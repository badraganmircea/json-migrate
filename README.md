# json-migrate

Tool for making changes of JSON-files with... other JSON files.

## Installation and running

### requirements
* node version >= 8

### install
`$ npm install -g json-migrate`

### run
`$ json-migrate`

## Example use case

Say you have the following simple JSON

```JSON
{
  "property1": {
    "innerProperty1": "value1"
  }
}
```

And want to add a property `innerProperty2` inside `property1`, like below:

```JSON
{
  "property1": {
    "innerProperty1": "value1",
    "innerProperty2": "value2"
  }
}
```

You can define a **mutation** operation of type `ADD`, like so:

```JSON
{
  "mutations": [
    {
      "type": "ADD",
      "definition": {
        "to": "property1.innerProperty2",
        "value": "value2"
      }
    }
  ]
}
```

Running the tool with the above mutation definition will make the wanted changes.

### Available CLI commands (TODO)

### Mutations (TODO)
