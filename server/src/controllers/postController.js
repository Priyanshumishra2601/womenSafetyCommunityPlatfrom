const { CommunityPost, User } = require('../models');

exports.getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'role']
        }
      ],
      order: [['id', 'DESC']]
    });

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch posts.', error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { content, type, location_tag, latitude, longitude } = req.body;
    if (!content || !type) {
      return res.status(400).json({ message: 'content and type are required.' });
    }

    if (!['safety_tip', 'incident_report'].includes(type)) {
      return res.status(400).json({ message: 'Invalid post type.' });
    }

    const latNum = latitude == null ? null : Number(latitude);
    const longNum = longitude == null ? null : Number(longitude);
    if ((latNum != null && Number.isNaN(latNum)) || (longNum != null && Number.isNaN(longNum))) {
      return res.status(400).json({ message: 'Invalid latitude/longitude.' });
    }

    const newPost = await CommunityPost.create({
      user_id: req.user.id,
      content,
      type,
      location_tag: location_tag || null,
      latitude: latNum,
      longitude: longNum
    });

    const postWithAuthor = await CommunityPost.findByPk(newPost.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'role'] }]
    });

    return res.status(201).json(postWithAuthor);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create post.', error: err.message });
  }
};

