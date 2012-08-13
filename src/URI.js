/*
libURI
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
 */

define(['underscore'], function(_){
	var uri = function(){

		var self = this;

		function get_host(url){
			var host = url.match(/(?::\/\/?)(.*?)(?:\/|\?|:)/);
			if(!host){
				host = url.match(/(.*?)(?:\/|\?|:)/);
			}

			if(host) {
				return host[1];
			} else return false;
		}

		function get_scheme(url){
			var scheme = url.match(/(.*):\/\//);
			if(scheme) {
				return scheme[0];
			} else return false;
		}

		function get_query(url){
			var query = url.match(/\?(.*?)(#|$)/);
			if(query) {
				return query_to_map(query[1]);
			} return false;
		}

		function get_hash(url){
			var fragment = url.match(/#(.*)/);
			if(fragment){
				return query_to_map(fragment[1]);
			} else return false;
		}

		// It is easier to parse the path when the host is already removed
		function get_path(url_no_host){
			var path = url_no_host.match(/\/(.*?)(\?|\.|$|#)/);

			if(path){
				return path[1];
			} else return false;
		}

		// Works with both hashes and query parameters
		function query_to_map(query_string){
			var query_map = {},
				queries = query_string.split("&"),
				i = queries.length,
				pair;

			while(i--){
				pair = queries[i].split('=');
				query_map[pair[0]] = pair[1];
			}
			return query_map;
		}

		// Works with both hashes and query parameters
		function map_to_query(map, starting_symbol){
			var query_string = "",
				first = true;
			_.each(map, function(v, k){
				if(first) {
					first = false;
					query_string += starting_symbol;
				} else {
					query_string += "&";
				}
				if(typeof v !== 'undefined'){
					query_string += k+"="+v;
				} else {
					query_string += k;
				}
			});
			return query_string;
		}

		function build_url(parsed_url){
			var url = "";
			if(parsed_url.scheme) url += parsed_url.scheme;
			if(parsed_url.host) url += parsed_url.host;
			if(parsed_url.path) url += "/" + parsed_url.path;
			if(parsed_url.query) {
				url += map_to_query(parsed_url.query, "?");
			}
			if(parsed_url.hash) url += map_to_query(parsed_url.hash, "#");
			return url;
		}

		this.parse = function(url_input){
			var host = get_host(url_input),
				// this is a bit of a hack:
				no_host = url_input.substr(url_input.search(host), url_input.length);

			return {
				host: get_host(url_input),
				scheme: get_scheme(url_input),
				query: get_query(url_input),
				hash: get_hash(url_input),
				path: get_path(no_host)
			}
		};

		this.set = function(url, part, value){
			var parsed_url = self.parse(url);
			if(part === 'path' && value[0] === '/'){ // removes the starting slash, if it exists
				value = value.substr(1, value.length);
			}

			if(part === 'query' || part === 'hash'){
				parsed_url[part] = _.extend(parsed_url[part], value);
			} else {
				parsed_url[part] = value;
			}
			return build_url(parsed_url);
		};

		// Note that value is only used to remove query parameters and hash fragments
		this.remove = function(url, part, value){
			var parsed_url = self.parse(url);
			if((part === 'query' || part === 'hash') && typeof value !== 'undefined'){
				_.each(value, function(v){
					delete(parsed_url[part][v]);
				});
			} else {
				delete(parsed_url[part]);
			}
			return build_url(parsed_url);
		}
	};

	return new uri;
});