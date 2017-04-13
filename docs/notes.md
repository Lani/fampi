Notes
=====

# Markdown
I really need to learn this. Some resources that could help on that:

* Official site: https://daringfireball.net/projects/markdown/
* Cheatsheet: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

# Authentication
Will currently use in memory session, later store them in the database. As this project is intended for a small scale projects with a small number of users per installation. If this objective should change it would be easy to migrate to Redis - or similar. Or even token based authentication if needed.

## References
* http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/

## Todo
* Implement [helmet]https://helmetjs.github.io/docs/

# Validation
### ecmamodel
Intresting syntax
https://github.com/mench/ecmamodel

# Dependency Injection
I will not continue to look into DI frameworks at the moment. Will use 
vanilla node/javascript to begin with.

## Why it's needed
http://blog.wolksoftware.com/the-current-state-of-dependency-inversion-in-javascript

## Existing Solutions
### Aurelia DI
States that it can be used on the server side.

Some useful(?) resources:
* http://aurelia.io/hub.html#/doc/article/aurelia/dependency-injection/latest/dependency-injection-basics
* https://stackoverflow.com/questions/34793723/assisted-injection-in-aurelia

### dependency-injection-es6
Looks promising, but new, fairly inactive and no community 
https://github.com/mench/dependency-injection-es6

### InversifyJS

### Scatter
Outdated docs? Not much activity. 
https://github.com/mariocasciaro/scatter

