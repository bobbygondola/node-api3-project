const express = require('express');
const router = express.Router();

//database
const db = require("./userDb")
const postdb = require("../posts/postDb")

//middleware
router.use(express.json())


//functions
router.post('/', validatePost, (req, res) => {
  const data = req.body;
  db.insert(data)
    .then(newUser => {
      res.status(201).json({newUser})
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "couldnt get post user" });
    });
});

router.post('/:id/posts', validateUserId, (req, res) => {
  const body = req.body;
  body.user_id = req.params.id
  postdb.insert(body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "error creating post" });
    });
});

router.get('/', (req, res) => {
  db.get()
  .then(users => {
    res.status(200).json({users})
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: "internal server error "});
  });
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  db.getById(id)
  .then(user => {
    res.status(200).json({user})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: "couldnt get user by id" });
  });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const userId = req.params.id;
  db.getUserPosts(userId)
  .then(posts => {
    res.status(200).json({posts})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: "couldnt get user posts" });
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  db.remove(id)
  .then(removed => {
    res.status(204).json(removed)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: "couldnt delete user by id" });
  });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  db.update(id, changes)
  .then(updatedUser => {
    res.status(200).json({updatedUser})
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: "couldnt update user" })
  })
  
});

//custom middleware+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function validateUserId(req, res, next) {
  db.getById(req.params.id)
  .then(user => {
    if (user) {
      req.user = user;
      next()
    } else if (!user){
      res.status(400).json({ error: "invalid user id"})
    }})
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: "internal server error" })
  })
}

function validateUser(req, res, next) {
  if (req.body) {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({ message: "Missing name" });
    }
  } else {
    res.status(400).json({ message: "Missing user data" });
  }
}

function validatePost(req, res, next) {
  if (req.body) {
    if(req.body.name){
      next()
    } else if (!req.body.name){
      res.status(400).json({ message: "missing required text field" })
    } else if (!req.body){
      res.status(400).json({ message: "missing post data" })
    }
  }
}

module.exports = router;
