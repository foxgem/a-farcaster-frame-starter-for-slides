# Known Issues

To generate the images in markdown correctly:

1. start a local http server:

```shell
python3 -m http.server 9000
```

2. use it in markdown files:

```markdown
![content-org](http://localhost:9000/contents/doc/content-org.png)
```
