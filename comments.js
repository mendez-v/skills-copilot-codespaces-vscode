// Create web server
// Usage: $ node comments.js
// http://localhost:8080

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
	var _url = request.url; // _url = path?query
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	var title = queryData.id;
	var description = queryData.id;
	var control = queryData.id;
	var body = '';
	var filteredId = path.parse(queryData.id).base;
	var filteredControl = path.parse(queryData.control).base;
	var filteredControl2 = path.parse(queryData.control2).base;

	if(pathname === '/'){
		if(queryData.id === undefined){
			fs.readdir('./data', function(error, filelist){
				title = 'Welcome';
				description = 'Hello, Node.js';
				control = `<a href="/create">create</a>`;
				var list = template.list(filelist);
				var html = template.HTML(title, list, 
					`<h2>${title}</h2>${description}`,
					`<a href="/create">create</a>`
				);
				response.writeHead(200);
				response.end(html);
			});
		} else {
			fs.readdir('./data', function(error, filelist){
				var filteredId = path.parse(queryData.id).base;
				fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
					var title = queryData.id;
					var control = `<a href="/create">create</a> 
					<a href="/update?id=${title}">update</a>
					<form action="/delete_process" method="post">
						<input type="hidden" name="id" value="${title}">
						<input type="submit" value="delete">
					</form>`;
					var sanitizedTitle = sanitizeHtml(title);
					var sanitizedDescription = sanitizeHtml(description, {
						allowedTags:['h1']
					});
					var list = template.list(filelist);
					var html = template.HTML(sanitizedTitle, list, 
						`<h2>${sanitizedTitle}</h2>${sanitizedDescription
