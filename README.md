# Orkidea Schedule

> A responsive plugin to show time intervals in a schedule of activities.

## Demo

[Click here to see the demo!](https://rawgit.com/ailtonbsj/orkidea-schedule/master/index.html)


## Install

### yarn
    
    yarn add orkidea-schedule

### npm

    npm install orkidea-schedule
    
### scripts

    <link rel="stylesheet" type="text/css" href="schedule.min.css">
    <script src="schedule.min.js"></script>

## Usage example

```javascript
//Data Source
var data = [
	{
	    inittime: '06/07/2018 08:00:00',
	    finaltime: '06/07/2018 09:00:00',
	    color: 'red',
	    text: 'Example 1',
	    yAxis: 'Room A'
	},
	{
	    inittime: '06/07/2018 11:00:00',
	    finaltime: '06/07/2018 12:00:00',
	    color: 'blue',
	    text: 'Example 2',
	    yAxis: 'Room B'
	}
];

//Configs
var config = {
    uniqueColor: 'indata'
};

//Initialize
new Orkidea.Schedule('my-id-of-element', data, config);

//Autoresize alternative
window.addEventListener("resize", function(){
	new Orkidea.Schedule('my-schedule', data, config);
});
```

## Configs options

### `uniqueColor`
- Type: `string`
- Value: `indata`

Use color from data source. If is undefined use from palette.

### `uniqueColor`
- Type: `string`
- Value: `color name or color code`

Define a unique color for all time interval.

### `uniqueColor`
- Type: `undefined` 

Use a random color from palette color.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`

**After your pull request is merged**, you can safely delete your branch.