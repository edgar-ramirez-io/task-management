## /signup

```shell
curl -d '{"username": "", "password": ""}' -H "Content-Type: application/json" -X POST http://localhost:3000/auth/signup/
```

## /signin

```shell
curl -d '{"username": "", "password": ""}' -H "Content-Type: application/json" -X POST http://localhost:3000/auth/signin/
```

## Need {token} for next endpoints:

## /tasks/

```shell
curl -d '{"title": "", "description": ""}' -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -X POST http://localhost:3000/tasks/
```

## /tasks/

```shell
curl -H "Authorization: Bearer {token}" -X GET http://localhost:3000/tasks/
```

## /tasks/id

```shell
curl -H "Authorization: Bearer {token}" -X DELETE http://localhost:3000/tasks/d0ba7137-f6e0-4a83-be51-d397739695be
```

## /tasks/id

```shell
curl -H "Authorization: Bearer {token}" -X GET http://localhost:3000/tasks/3b57066e-c8dd-428b-882d-7649778edc3d
```
