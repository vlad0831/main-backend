### Example static asset queries and mutations

#### Query `getStaticAssetList`

- with filters

```
query Query($categoryList: [CategoryFilterItem!], $nameList: [String!], $typeList: [TypeStaticAsset!]) {
  getStaticAssetList(categoryList: $categoryList, nameList: $nameList, typeList: $typeList) {
    id
    name
    order
    tag
    type
    description
    category
    asset {
      id
      name
      tag
      url
      description
    }
  }
}
```

Possible filter values:

```json
{
  "categoryList": [
    {
      "category": "Splash",
      "orderList": [1, 1, 2]
    }
  ],
  "nameList": ["Test name"],
  "typeList": ["Text", "Animation", "Image"]
}
```

Response

```json
{
  "data": {
    "getStaticAssetList": [
      {
        "id": "a655cd56-8603-4141-8e3e-245953571257",
        "name": "Test1",
        "order": 4,
        "tag": ["tag1"],
        "type": "Image",
        "description": "description",
        "category": "Splash",
        "asset": {
          "id": "898af1a6-40f5-45b9-a8c9-643df1310944",
          "name": "img",
          "tag": ["tag"],
          "url": "https://mybucket.s3.amazonaws.com/prod/my%20tag.png",
          "description": "description"
        }
      },
      {
        "id": "336534b5-ce1e-4bcf-8773-77da7a3624c6",
        "name": "Test2",
        "order": 5,
        "tag": ["tag2"],
        "type": "Text",
        "description": "description",
        "category": "Splash",
        "asset": {
          "id": "efb7b9ed-4abc-421d-94bf-9babb7b6581b",
          "name": "test text",
          "tag": ["tag"],
          "url": null,
          "description": "test"
        }
      }
    ]
  }
}
```

#### Mutation `setStaticAssetList`

Available only for admin users.

1. creating new static assets

```
mutation SetStaticAssetListMutation($staticAssetList: [StaticAssetAllocationInput!]!) {
  setStaticAssetList(staticAssetInputList: $staticAssetList) {
    id
    name
    order
    tag
    type
    description
    category
    asset {
      id
      name
      tag
      url
      description
    }
  }
}
```

Input params:

```json
{
  "staticAssetList": [
    {
      "category": "Splash",
      "description": "description",
      "name": "Test",
      "order": 2,
      "tag": ["my tag"],
      "type": "Image",
      "asset": {
        "name": "test",
        "description": "test",
        "s3Bucket": "testbucket",
        "s3Tag": "folder1/test.png",
        "tag": ["test tag"]
      },
      "role": ["Admin"]
    }
  ]
}
```

Successful response is the same as for query `getStaticAssetList`.

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

- Input validation - user sends invalid input data

```json
{
  "errors": [
    {
      "message": "Bad Request Exception",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "response": {
          "statusCode": 400,
          "message": ["<error message>"],
          "error": "Bad Request"
        }
      }
    }
  ]
}
```

2. updating existing static assets.

For updating client has to pass `id`, all other parameters are optional.

Input params:

```json
{
  "staticAssetList": [
    {
      "id": "efb7b9ed-4abc-421d-94bf-9babb7b6581b",
      "name": "Test"
    }
  ]
}
```
