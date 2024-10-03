import { createConfiguration, ServerConfiguration, ThoughtSpotRestApi } from "@thoughtspot/rest-api-sdk";
import { useState } from "react";
import ColumnSelection, { ColumnConfiguration } from "./config/ColumnSelection";



export const TS_URL = "https://se-thoughtspot-cloud.thoughtspot.cloud"
export const WORKSHEET_ID = "782b50d1-fe89-4fee-812f-b5f9eb0a552d"
const App: React.FC = () => { 
  const [columnConfiguration, setcolumnConfiguration] = useState<ColumnConfiguration | null>(null);


  return (
    <div className="w-full">
      <ColumnSelection columnConfiguration={columnConfiguration} setColumnConfiguration={setcolumnConfiguration} />
    </div>
  )
};

export default App;

export const createClientWithoutAuth = () => {
  const config = createConfiguration({
    baseServer: new ServerConfiguration(TS_URL, {}),
  });
  const tsRestApiClient = new ThoughtSpotRestApi(config);
  return tsRestApiClient;
};
