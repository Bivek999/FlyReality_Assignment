const fs = require("fs");
const express = require("express");

const app = express();

var cors = require("cors");
const bodyParser = require("body-parser");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const Excel = require("exceljs");

app.post(`/add_questions/:doc_id`, (req, res) => {
  var docs_data = req.body;
  var name = req.params.doc_id;
  console.log(docs_data);
  let data = JSON.stringify(docs_data);
  fs.writeFileSync(`files/${name}.json`, data);
});

app.get("/data/:doc_id", (req, res) => {
  var docId = req.params.doc_id;
  fs.readFile(`file/${docId}.json`, (err, data) => {
    if (err) throw err;
    let ques_data = JSON.parse(data);
    console.log(req.params.doc_id);
    res.send(ques_data);
  });
});

const path = require("path");

app.get("/get_all_filenames", (req, res) => {
  const directoryPath = path.join(__dirname, "/files");

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("unable to scan directory: " + err);
    }
    res.send(files);
  });
});

app.post(`/others_responses/:doc_id`, (req, res) => {
  var infodata = req.body;
  var name = req.params.doc_id;
  let workbook = new Excel.Workbook();
  var data = req.body.answer_data;
  let worksheet = workbook.addWorksheet(`${name}`);

  worksheet.columns = [
    { header: "Time stamp", key: "datetime" },
    ...infodata.column,
  ];
  worksheet.columns.forEach((column) => {
    column.width = column.header.length < 16 ? 16 : column.header.length;
  });

  worksheet.getRow(1).font = { bold: true };

  data.forEach((e, index) => {
    const rowIndex = index + 1;
    worksheet.addRow({ d, ...e });
  });
  workbook.xlsx.writeFile(`${name}.xlxs`);
});

app.listen(8000, () => {
  console.log("express server is running at port 8000");
});
