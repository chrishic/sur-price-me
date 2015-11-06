# To do list:

* ~~Don't return 404's if no results returned from successful database call; instead return response indicating 0 results~~
* ~~Config flag to allow 'city' query parameter without requiring 'item' query parameter~~
* ~~Better logging and profiling~~
* ~~Add unit tests~~
* Run under load with JMeter to measure performance
* Consider installing/utilizing `pg-native` module - test to see what (if any) performance gain we get
* Run under Ubuntu
* Create branch where mode is calculated on server (instead of during db call) - do this to compare running performance
* Think about where we might be able to employ caching
