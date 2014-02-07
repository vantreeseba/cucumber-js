var OutlineStep = function(keyword, name, uri, line) {
	var Cucumber = require('../../cucumber');  

	var self = {
		toStep: function(exampleRow){
			//Cucumber.Ast.Step(keyword, name, description, uri, line);
		var name = outline.getName(),
        table = Cucumber.Ast.DataTable(),
        rows = [],
        hasDocString = outline.hasDocString(),
        hasDataTable = outline.hasDataTable(),
        oldDocString = hasDocString ? outline.getDocString() : null,
        docString = hasDocString ? oldDocString.getContents() : null,
        hashKey;

     if (hasDataTable){
       outline.getDataTable().getRows().syncForEach(function(row){
         var newRow = { 
             line: row.getLine(), 
             cells: JSON.stringify(row.raw()) 
           };
         rows.push(newRow);
       });
     }

     for (hashKey in example) {
       if (Object.prototype.hasOwnProperty.call(example, hashKey)) {        
         var findText = '<' + hashKey + '>';
         var exampleData = example[hashKey];    
           
         name = name.replace(findText, exampleData);         
           
         if (hasDataTable) {
           rows = rows.map(function(row){
             return {line:row.line, cells:row.cells.replace(findText, exampleData)};
           });
         }
           
         if (hasDocString) {
           docString = docString.replace(findText, exampleData);
         }
       }
     }


      var step = Cucumber.Ast.Step(outline.getKeyword(),name, outline.getLine());

      if (hasDataTable) {
        rows.forEach(function(row){
          table.attachRow( Cucumber.Ast.DataTable.Row( JSON.parse(row.cells), row.line) );
        });
        step.attachDataTable(table);
      }

      if (hasDocString) {
        step.attachDocString( Cucumber.Ast.DocString(oldDocString.getContentType(), docString, oldDocString.getLine()));
      }
      
      return step;
		}
	};

	return self;
};

module.exports = Step;
