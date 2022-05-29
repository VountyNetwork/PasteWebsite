# PasteWebsite
Official website source code of [paste.vounty.net](https://paste.vounty.net).

# API
#### All URLs are POST requests only.
```
https://api.vounty.net/paste/create
```
With the <mark style="background-color: #171717; color: #fff; border-radius: 7px; padding: 4px;">/paste/create</mark> you can create your own Paste.

| Field         | Type     | Can be empty |
|--------------|-----------|------------|
| document | String      | No        |
| language | String      | No        |
| publisher | String      | No        |
| password | String      | Yes        |
```
https://api.vounty.net/paste/delete
```
With the <mark style="background-color: #171717; color: #fff; border-radius: 7px; padding: 4px;">/paste/delete</mark> you delete any Paste with the deleteToken attribute.

| Field         | Type     | Can be empty |
|--------------|-----------|------------|
| document | String      | No        |
| deleteToken | String      | No        |
```
https://api.vounty.net/paste/checkPassword
```
With the <mark style="background-color: #171717; color: #fff; border-radius: 7px; padding: 4px;">/paste/checkPassword</mark> you can detect, if the password is correct of the paste.

| Field         | Type     | Can be empty |
|--------------|-----------|------------|
| document | String      | No        |
| password | String      | No        |
---
```
https://api.vounty.net/paste/about
```
With the <mark style="background-color: #171717; color: #fff; border-radius: 7px; padding: 4px;">/paste/about</mark> you can receive any Paste from the ID of the Paste. (Document)

| Field         | Type     | Can be empty |
|--------------|-----------|------------|
| document | String      | No        |
| password | String      | Yes        |
