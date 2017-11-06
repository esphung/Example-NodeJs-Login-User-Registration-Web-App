import urllib.request, json

baseUrl = "http://localhost:5000/"

# GET test vars
handle = "james"
expected = "b"+"'{"+'"id":'+str(27)+','+'"handle":"'+handle+'"}'+"'".format(handle)

# GET request
if (str(urllib.request.urlopen("{}users/?handle={}".format(baseUrl,handle)).read()) != expected):
	# test did not pass
	print("Get Request Test: Failed")
	print(str(urllib.request.urlopen("http://localhost:5000/users/?handle={}".format(handle)).read()))
	print(expected)
else:
	print("GET passed")

