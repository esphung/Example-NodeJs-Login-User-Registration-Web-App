# -*- coding: utf-8 -*-
# @Author: eric phung
# @Date:   2017-11-19 00:12:15
# @Last Modified 2017-11-19
# @Last Modified time: 2017-11-19 01:14:10

baseurl = "http://localhost:5000/"
#baseurl = "https://whispering-beach-15540.herokuapp.com/"
username = "fbar"
password = "superword1234"

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Firefox()

# ACCOUNT LOGIN
driver.get("{}users/login/".format(baseurl))
assert "Example" in driver.title

# username
elem = driver.find_element_by_name("username")
elem.clear()
elem.send_keys(username)

# password
elem = driver.find_element_by_name("password")
elem.clear()
elem.send_keys(password)

elem.send_keys(Keys.RETURN)

"""# ACCOUNT LOGOUT
driver.get("{}".format(baseurl))
driver.get("{}users/logout/".format(baseurl))
if "You are logged out" in driver.page_source:
	print("Passed")
"""
#driver.close()