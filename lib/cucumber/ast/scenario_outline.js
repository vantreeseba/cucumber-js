var ScenarioOutline = function (keyword, name, description, uri, line) {
  var Cucumber = require('../../cucumber');
  var self = Cucumber.Ast.Scenario(keyword, name, description, uri, line);
  var examples;

  self.payload_type = 'scenarioOutline';
  
  self.setExamples = function (newExamples) {
    examples = newExamples;
  };
  
  self.getExamples = function () {
    return examples;
  };
  
  self.applyExampleRow = function(example, steps){
    return steps.syncMap(function (outline) {
      var outline_step = Cucumber.Ast.OutlineStep(step);
    });
  };
  
  self.acceptVisitor = function (visitor, callback) {
    var rows = examples.getDataTable().getRows(),
      first_row = rows.shift().raw();
    rows.syncForEach(function(row, index){      
      row.example = {};
      row.id = index;
      for (var i = 0, ii = first_row.length; i < ii; i++){
        row.example[first_row[i]] = row.raw()[i];
      }
    });

    rows.forEach(function (row, iterate){
      self.instructVisitorToVisitRowSteps(visitor, row, iterate);
    },callback)
  };

  self.instructVisitorToVisitRowSteps = function (visitor, row, callback) {
    visitor.visitRow(row, self, callback);
  };

  self.visitRowSteps = function (visitor, row, callback) {
    self.instructVisitorToVisitBackgroundSteps(visitor, function () {
      var newSteps = self.applyExampleRow(row.example, self.getSteps());
      self.instructVisitorToVisitSteps(visitor, newSteps, callback);
    });
  };

  return self;
};
module.exports = ScenarioOutline;

