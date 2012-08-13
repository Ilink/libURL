libURL
=======
A simple library to parse and manipulate common elements of URLs.
Uses RequireJS to load everything. It's perfect for this type of library.

Parse simply returns a map of all the most common URI parts.
This doesn't parse every URI part, just the most common ones.
	- notably absent are port and password. The inclusion of these may break some parsing.

'Remove' allows the removal of parts from the URL.
The behavior is a little different for query parameters and hash fragments.
EG:
	URI.remove('www.test.com?a=1', 'query', ['query'])
This will remove the "a" query parameter from the URL.
However, if the array of stuff to remove is absent, the whole query part is removed from the URI.
The same is true for 'hash'

The same kind of behavior exists for 'set'.
However, the value parameter specifies stuff to add to the query or hash.
EG:
	URI.set('www.test.com?a=1', 'query', { b: 2 })
Would result in:
	www.test.com?a=1&b=2

For single-value parts of the URL, any primitive type will do.
EG:
	URI.set('www.test.com?a=1', 'scheme', 'https://')
Would result in:
	https://www.test.com?a=1

Note that the behavior for query/hash fragments without values utilizes 'undefined'.
EG:
	https://www.test.com?a
Would be represented as:
	{ a: undefined }
This may not be the best way of handling this behavior, but it works for now.

Finally, due to the way query parameters and hashes get built, their order is not guaranteed.
This may cause tests to fail simply because the hash/query is in the wrong order.
I didn't design around the issue, simply because I don't forsee parameter order to be an issue.