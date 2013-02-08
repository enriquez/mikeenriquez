---
layout: post
title: awakeFromNib not called
---

If you're wondering why your `awakeFromNib` method is not getting called, check out #4 in the docs on [The Object Loading Process](https://developer.apple.com/library/mac/#DOCUMENTATION/Cocoa/Conceptual/LoadingResources/CocoaNibs/CocoaNibs.html#//apple_ref/doc/uid/10000051i-CH4-SW19).  Basically, `awakeFromNib` is not called on placeholder objects such as File's Owner and First Responder in iOS.
