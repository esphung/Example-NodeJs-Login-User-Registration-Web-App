# -*- coding: utf-8 -*-
# @Author: eric phung
# @Date:   2017-11-18 20:09:13
# @Last Modified 2017-11-19
# @Last Modified time: 2017-11-19 00:12:07

baseurl = "http://localhost:5000/"
#baseurl = "https://whispering-beach-15540.herokuapp.com/"
username = "fbar"
password = "superword1234"

from selenium import webdriver
from selenium.webdriver.common.keys import Keys


driver = webdriver.Firefox()

# ACCOUNT REGISTER
driver.get("{}users/register/".format(baseurl))
assert "Example" in driver.title

delay = 3 # seconds

# first name
elem = driver.find_element_by_name("fname")
elem.clear()
elem.send_keys("foo")

# lastname
elem = driver.find_element_by_name("lname")
elem.clear()
elem.send_keys("bar")

# username
elem = driver.find_element_by_name("username")
elem.clear()
elem.send_keys(username)

# phone
elem = driver.find_element_by_name("phone")
elem.clear()
elem.send_keys("3179031456")

# email
elem = driver.find_element_by_name("email")
elem.clear()
elem.send_keys("fbar@gmail.com")

# password
elem = driver.find_element_by_name("password")
elem.clear()
elem.send_keys(password)

# password2
elem = driver.find_element_by_name("password2")
elem.clear()
elem.send_keys(password)

elem.send_keys(Keys.RETURN)
	
driver.close()

# retrieve new user
import urllib.request
print(urllib.request.urlopen("{}api/?username={}".format(baseurl,username)).read())

