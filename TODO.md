# To do list:

* ~~Don't return 404's if no results returned from successful database call; instead return response indicating 0 results~~
* Add unit tests
* Run under load with JMeter to measure performance
* Config flag to allow 'city' query parameter without requiring 'item' query parameter
* Better logging and profiling
* Consider installing/utilizing `pg-native` module - test to see what (if any) performance gain we get
* Create branch where mode is calculated on server (instead of during db call) - do this to compare running performance
* Run under Ubuntu
* Think about where we might be able to employ caching
