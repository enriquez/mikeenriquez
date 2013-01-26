---
layout: post
title: UIAlertView and UIActionSheet with Blocks and Target/Action Invocations
---

The delegate methods for UIAlertView and UIActionSheet in my app were getting out of control, so I had to refactor.  I came up with subclasses that added a block and target-action API.  Instead of having a long delegate method to handle all the button actions, you can now specify the action in a block or a separate method.

Check out [MEAlertView](http://github.com/enriquez/MEAlertView) and [MEActionSheet](http://github.com/enriquez/MEAlertView)
