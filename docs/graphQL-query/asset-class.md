### Example asset class queries and mutations

#### Query `getAssetClassList`

Request

- without `idList`

```
query Query {
    getAssetClassList {
       id
       name
       description
    }
}
```

- with `idList`

```
query Query {
    getAssetClassList(idList: $idList) {
        id
        name
        description
    }
}
```

```json
{
  "idList": [
    "d5743df5-0caa-42f0-b93d-0cdea4b0223b",
    "29bbee81-4904-45ba-8c4d-bbdfc2aeaf5d"
  ]
}
```

Successful response

```json
{
  "data": {
    "getAssetClassList": [
      {
        "id": "29bbee81-4904-45ba-8c4d-bbdfc2aeaf5d",
        "name": "test",
        "description": "test1"
      },
      {
        "id": "d5743df5-0caa-42f0-b93d-0cdea4b0223b",
        "name": "test2",
        "description": "test2"
      }
    ]
  }
}
```

Failed responses

- Asset class not found

```json
{
  "errors": [
    {
      "message": "Asset class not found",
      "extensions": {
        "assetClassId": "c020a7c1-f46f-4fb2-97b9-1f85bb545f41",
        "code": "NOT_FOUND_ERROR"
      }
    }
  ],
  "data": null
}
```

#### Query `getUserAssetClassList`

Request

- without `userId`

```
query Query {
    getUserAssetClassList {
        id
        name
        description
    }
}
```

- with `userId`

```
query Query {
    getUserAssetClassList(userId: $userId) {
        id
        name
        description
    }
}
```

Successful response

```json
{
  "data": {
    "getUserAssetClassList": [
      {
        "id": "29bbee81-4904-45ba-8c4d-bbdfc2aeaf5d",
        "name": "test",
        "description": "test1"
      }
    ]
  }
}
```

Failed responses

- Forbidden - user does not have access to the resource

```json
{
  "errors": [
    {
      "message": "Forbidden",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}
```

- User not found

```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "NOT_FOUND_ERROR"
      }
    }
  ],
  "data": null
}
```

- Unauthenticated

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "response": {
          "statusCode": 401,
          "message": "Unauthorized"
        }
      }
    }
  ],
  "data": null
}
```

#### Mutation `setUserInvestmentWorkflow`

Request

- without `userId`

```
mutation Mutation($assetClassIdList: [String!]!) {
  setUserInvestmentWorkflow(assetClassIdList: $assetClassIdList) {
    assetClassList {
      id
      name
      description
    }
    userId
  }
}
```

Params:

```json
{
  "assetClassIdList": ["e7e4a19e-a63b-431a-b1b5-c80fdeaec39d"]
}
```

- with `userId`

```
mutation Mutation($assetClassIdList: [String!]!, $userId: String) {
  setUserInvestmentWorkflow(assetClassIdList: $assetClassIdList, userId: $userId) {
    assetClassList {
      id
      name
      description
    }
    userId
  }
}
```

Successful response

```json
{
  "data": {
    "setUserInvestmentWorkflow": {
      "assetClassList": [
        {
          "id": "e7e4a19e-a63b-431a-b1b5-c80fdeaec39d",
          "name": "test",
          "description": "test description"
        }
      ],
      "userId": "e6442f88-b8ff-42b9-a55f-7f7d8c60a893"
    }
  }
}
```

Failed responses

- Forbidden - user does not have access to the resource

```json
{
  "errors": [
    {
      "message": "Forbidden",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}
```

- User not found

```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "NOT_FOUND_ERROR"
      }
    }
  ],
  "data": null
}
```

- Asset class not found

```json
{
  "errors": [
    {
      "message": "Asset class not found",
      "extensions": {
        "assetClassId": "c020a7c1-f46f-4fb2-97b9-1f85bb545f41",
        "code": "NOT_FOUND_ERROR"
      }
    }
  ],
  "data": null
}
```

- Unauthenticated

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "response": {
          "statusCode": 401,
          "message": "Unauthorized"
        }
      }
    }
  ],
  "data": null
}
```
