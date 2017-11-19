# -*- coding: utf-8 -*-
# @Author: eric phung
# @Date:   2017-11-18 20:09:13
# @Last Modified 2017-11-18
# @Last Modified time: 2017-11-18 23:16:39

baseurl = "http://localhost:5000/"
#baseurl = "https://whispering-beach-15540.herokuapp.com/"
username = "fbar"

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

driver = webdriver.Firefox()
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
elem.send_keys("superword1234")


# password2
elem = driver.find_element_by_name("password2")
elem.clear()
elem.send_keys("superword1234")

elem.send_keys(Keys.RETURN)

assert "First Name is required" not in driver.page_source
assert "Last Name is required" not in driver.page_source
assert "Username is required" not in driver.page_source
assert "Email is required" not in driver.page_source
assert "Password is required" not in driver.page_source
assert "Passwords do not match" not in driver.page_source
	
driver.close()

# retrieve new user
import urllib.request
print(urllib.request.urlopen("{}api/?username={}".format(baseurl,username)).read())
