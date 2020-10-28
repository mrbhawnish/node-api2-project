const express = require("express");
const Db = require("../data/db");
const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  Db.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Db.findById(req.params.id)
    .then((post) => {
    //   console.log(post);
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json(post);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    //   console.log(error);
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Db.findPostComments(req.params.id)
    .then((post) => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json(post);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    //   console.log(error);
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  const newPost = {
    title: title,
    contents: contents,
  };
  try {
    if (!title || !contents) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post.",
      });
    } else {
      Db.insert(newPost);
      res.status(201).json(newPost);
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      error: "There was an error while saving the post to the database",
    });
  }
});

router.post("/:id/comments", (req, res) => {
  const { text } = req.body;
  const newComment = { post_id: req.params.id, ...req.body };

  Db.find()
    .then((posts) => {
      const post = posts.filter((post) => post.id == req.params.id);
      if (!post.length) {
        res.status(404).json({
          //NOT FOUND REQUEST
          message: "The post with the specified ID does not exist.",
        });
      } else if (!text) {
        //If there's no comment provided
        res.status(400).json({
          //BAD REQUEST
          errorMessage: "Please provide comment for the post.",
        });
      } else {
        Db.insertComment(newComment)
          .then((comment) => {
            // console.log(comment);
            res.status(201).json(comment);
          })
          .catch((error) => {
            //DATABASE ERROR
            res.status(500).json({ message: "comment could not be added" });
            // console.log(error);
          });
      }
    })
    .catch((error) => {
      //    console.log(error.message, error.stack)
      res.status(500).json({
        //DATABASE ERROR
        error: "The post information could not be retrieved.",
      });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Db.findById(id)
    .then((post) => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        Db.findById(id)
          .then((post) => {
            {
              res.status(200).json(post);
            }
            Db.remove(req.params.id)
              .then((res) => { 
                //   console.log(res)
                })
              .catch((error) =>
                res.status(500).json({ message: "Databassese error" })
              );
          })
          .catch((error) => {
            res.status(500).json({ message: "Database error" });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Outer Database error" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  const newPost = { title: title, contents: contents };

  Db.findById(id).then((post) => {
    if (!post.length) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else if (!title || !contents) {
      res
        .status(400)
        .json({
          errorMessage: "Please provide title and contents for the post.",
        });
    } else {
      Db.update(req.params.id, newPost)
        .then((update) => {
          Db.findById(id).then((post) => {
            res.status(200).json(post);
          });
        })
        .catch((error) => {
          res.status(500).json({ message: "Something went wrong inside" });
        })

        .catch((error) => {
          res.status(500).json({ message: "Something went wrong" });
        });
    }
  });
});


module.exports = router;
