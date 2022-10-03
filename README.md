# Surreal.js

This package provides a asynchronously "RPC-Wrapper" for SurrealDB using `ws`.

## Why?

Actually SurrealDB provides a "wrapper" / driver created by some users ([surrealdb.js](https://github.com/surrealdb/surrealdb.js)), but I didn't like the code at all.
That's why I started to create my own "wrapper" / driver with a better & readable code.

## Example

Example of how to `select` from `users` table:

```
(async () => {
  const surreal = new Surreal({
    host: '127.0.0.1',
    port: 8000,
    user: 'user',
    pass: 'password',
    ns: 'myNamespace',
    db: 'myDatabase',
    ssl: false,
  });

  await surreal.signIn();

  const persons = await surreal.select<
    {company: string; id: string; name: string; skills: string[]}[]
  >('persons');

  persons.forEach((e) => console.log(e));
})();
```

Result:

```
{
  company: 'SurrealDB',
  id: 'users:x173nmutw0nzrt4fnixz',
  name: 'Tobie',
  skills: [ 'Rust', 'Go', 'JavaScript' ]
}
```
