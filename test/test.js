require(['../src/URI'], function(URI){

	var url = "https://www.test.com/test/a?query1=1&query2=2#hash1=1";
	var url2 = "www.test.com/test";
	var url3 = "www.test.com/test#hash";

	test('URL parsing', function(){
		var output = URI.parse(url);
		deepEqual(output, {
			scheme: "https://",
			path: "test/a",
			host: "www.test.com",
			query: {
				query1:'1',
				query2:'2'
			},
			hash: {
				hash1:'1'
			}
		});

		output = URI.parse(url2);
		deepEqual(output, {
			scheme: false,
			path: "test",
			host: "www.test.com",
			query: false,
			hash: false
		});

		output = URI.parse(url3);
		deepEqual(output, {
			scheme: false,
			path: "test",
			host: "www.test.com",
			query: false,
			hash: {
				hash:undefined
			}
		});
	});

	test('URI part assignment', function(){
		var output = URI.set(url, 'query', {query1: 20});
		deepEqual(output, "https://www.test.com/test/a?query2=2&query1=20#hash1=1");

		output = URI.set(url, 'hash', {hash1: 20});
		deepEqual(output, "https://www.test.com/test/a?query2=2&query1=1#hash1=20", "Can edit a parameter");

		output = URI.set(url, 'hash', {hash2: 40});
		deepEqual(output, "https://www.test.com/test/a?query2=2&query1=1#hash1=1&hash2=40", "Can add a new parameter");

	});

	test('URI part removal', function(){
		var output = URI.remove(url, "scheme");
		deepEqual(output, "www.test.com/test/a?query2=2&query1=1#hash1=1", "Should be able to remove a whole component");

		output = URI.remove(url, "query", ['query2']);
		deepEqual(output, "https://www.test.com/test/a?query1=1#hash1=1", "Should be able to remove part of a component");
	});

});
