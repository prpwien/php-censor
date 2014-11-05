var phpspecPlugin = PHPCI.UiPlugin.extend({
    id: 'build-phpspec-errors',
    css: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
    title: 'PHPSpec',
    lastData: null,
    displayOnUpdate: false,
    box: true,
    rendered: false,

    register: function() {
        var self = this;
        var query = PHPCI.registerQuery('phpspec', -1, {key: 'phpspec'})

        $(window).on('phpspec', function(data) {
            self.onUpdate(data);
        });

        $(window).on('build-updated', function() {
            if (!self.rendered) {
                self.displayOnUpdate = true;
                query();
            }
        });
    },

    render: function() {

        return $('<table class="table table-striped" id="phpspec-data">' +
            '<thead>' +
            '<tr>' +
            '   <th>Suite</th>' +
            '   <th>Test</th>' +
            '   <th>Result</th>' +
            '</tr>' +
            '</thead><tbody></tbody></table>');
    },

    onUpdate: function(e) {
        if (!e.queryData) {
            $('#build-phpspec-errors').hide();
            return;
        }

        this.rendered = true;
        this.lastData = e.queryData;

        var tests = this.lastData[0].meta_value;
        var tbody = $('#phpspec-data tbody');
        tbody.empty();

        for (var i in tests.suites) {
			var test_suite = tests.suites[i];

			for(var k in test_suite.cases){
				var test_case = test_suite.cases[k];

				var row = $(
					'<tr>'+
						'<td>'+test_suite.name+'</td>'+
						'<td title="Took '+test_case['time']+'Seconds">'+test_case.name+'</td>'+
						'<td>'+(test_case.message?test_case.message:'OK')+'</td>'+
					'</tr>'
				);

				if (test_case.status!='passed') {
					row.addClass('danger');
				} else {
					row.addClass('success');
				}

				tbody.append(row);
			}
        }
        
        // show plugin once preparation of grid is done
        $('#build-phpspec-errors').show();
    }
});

PHPCI.registerPlugin(new phpspecPlugin());
