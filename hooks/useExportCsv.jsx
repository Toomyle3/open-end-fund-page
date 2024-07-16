import FileSaver from "file-saver";
import JSZip from "jszip";
import moment from "moment";

const useExportCsv = () => {
  const handleExportCSV = (selectedFunds, filteredData) => {
    if (
      !selectedFunds ||
      selectedFunds.length === 0 ||
      !filteredData ||
      filteredData.length === 0
    ) {
      return;
    }
    const zip = new JSZip();
    selectedFunds.forEach((fund) => {
      const header = ["date", fund];
      const rows = filteredData
        .filter((row) => row[fund] !== undefined && row[fund] !== null)
        .map((row) => [
          moment(row.date * 1000).format("YYYY-MM-DD"),
          row[fund],
        ]);
      const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
      zip.file(`${fund}.csv`, csvContent);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      FileSaver.saveAs(content, "funds_data.zip");
    });
  };
  return { handleExportCSV };
};

export default useExportCsv;
