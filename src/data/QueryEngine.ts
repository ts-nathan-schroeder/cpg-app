import { ColumnConfiguration } from "../config/ColumnSelection";


interface BaselineResult {
    primaryDimension: string,
    primaryMetric: number,
    baselineMetric: number,
    pctOfTotal: number,
    pctChange: number,
    rawChange: number,
    weightedChange: number
}

const getBaselineData = (config: ColumnConfiguration) => {
    const query = `[${config.primaryDimension.name}] [${config.primaryMetric.name}] [${config.baselineMetric.name}]`

    const data: any[] = []
    for (let i =0; i < data.length; i++){
        let row = data[i];
        let weight = row[config.baselineMetric.name]
    }

}