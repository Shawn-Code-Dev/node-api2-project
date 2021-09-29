const express = require('express')
const Post = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) => {
  Post.find(req.query)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ 
        message: "The posts information could not be retrieved",
        err: err.message,
        stack: err.stack
      })
    })
})

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(404).json({ 
          message: "The post with the specified ID does not exist" 
      })
      } else {
        res.status(200).json(post)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ 
        message: "The post information could not be retrieved",
        err: err.message,
        stack: err.stack 
      })
    })
})

router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({ 
      message: "Please provide title and contents for the post" 
  })
  } else {
    Post.insert(req.body)
      .then(({ id }) => {
        return Post.findById(id)
      })
      .then(post => {
        res.status(201).json(post)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ 
          message: "There was an error while saving the post to the database",
          err: err.message,
          stack: err.stack 
        })
      })
  }
})

router.put('/:id', (req, res) => {
  const update = req.body
  const id = req.params.id

  if (!update.title || !update.contents) {
    res.status(400).json({ 
      message: "Please provide title and contents for the post" 
  })
  } else {
    Post.update(id, update)
      .then(id => {
        return Post.findById(id)
      })
      .then(post => {
        if (!post) {
          res.status(404).json({ 
            message: "The post with the specified ID does not exist" 
        })
        } else {
          res.status(200).json(post)
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ 
          message: "The post information could not be modified",
          err: err.message,
          stack: err.stack 
        })
      })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const post = await Post.findById(id)
  
  Post.remove(id)
    .then(records => {
      if (records > 0) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ 
          message: "The post with the specified ID does not exist" 
      })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ 
        message: "The post could not be removed",
        err: err.message,
        stack: err.stack 
      })
    })
})

router.get('/:id/comments', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(404).json({ 
          message: "The post with the specified ID does not exist" 
      })
      } else {
        Post.findPostComments(req.params.id)
          .then(comments => {
            res.status(200).json(comments)
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({ 
              message: "The comments information could not be retrieved",
              err: err.message,
              stack: err.stack 
            })
          })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ 
        message: "The post information could not be retrieved",
        err: err.message,
        stack: err.stack 
      })
    })
})

module.exports = router
