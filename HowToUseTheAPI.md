## POST auth/signup

```shell
curl -d '{"username": "", "password": ""}' -H "Content-Type: application/json" -X POST http://localhost:3000/auth/signup/
```

## POST auth/signin

```shell
curl -d '{"username": "", "password": ""}' -H "Content-Type: application/json" -X POST http://localhost:3000/auth/signin/
```

## Need {token} for next endpoints:

## POST /tasks/

```shell
curl -d '{"title": "", "description": ""}' -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -X POST http://localhost:3000/tasks/
```

## GET /tasks/

```shell
curl -H "Authorization: Bearer {token}" -X GET http://localhost:3000/tasks/
```

## DEL /tasks/id

```shell
curl -H "Authorization: Bearer {token}" -X DELETE http://localhost:3000/tasks/{token}
```

## GET /tasks/id

```shell
curl -H "Authorization: Bearer {token}" -X GET http://localhost:3000/tasks/{task-id}
```
