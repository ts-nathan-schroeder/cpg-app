import { useEffect, useState } from "react";
import { createClientWithoutAuth, WORKSHEET_ID } from "../App";

export enum ColumnType {
    MEASURE,
    ATTRIBUTE,
    DATE
}

export enum DateAggregation {
    DAILY,
    WEEKLY,
    MONTHLY,
    QUARTERLY,
    YEARLY
}

export interface Column {
    name: string;
    type: ColumnType;
}

export interface ColumnConfiguration {
    metrics: Column[];
    dimensions: Column[];
    primaryMetric: Column | null;
    baselineMetric: Column | null;
    primaryDimension: Column | null;
    dateAggregation: DateAggregation | null;
}

interface ColumnSelectionProps {
    columnConfiguration: ColumnConfiguration | null;
    setColumnConfiguration: (config: ColumnConfiguration) => void;
}

const ColumnSelection: React.FC<ColumnSelectionProps> = ({
    columnConfiguration,
    setColumnConfiguration,
}) => {
    const [columns, setColumns] = useState<Column[]>([]);
    const [metrics, setMetrics] = useState<Column[]>([]);
    const [dims, setDims] = useState<Column[]>([]);
    const [primaryMetric, setPrimaryMetric] = useState<Column | null>(null);
    const [baselineMetric, setBaselineMetric] = useState<Column | null>(null);
    const [primaryDim, setPrimaryDim] = useState<Column | null>(null);
    const [dateAgg, setDateAgg] = useState<DateAggregation | null>(null);

    useEffect(() => {
        let client = createClientWithoutAuth();
        client?.exportMetadataTML({
            metadata: [
                {
                    identifier: WORKSHEET_ID,
                    type: 'LOGICAL_TABLE',
                },
            ],
        }).then((data) => {
            let worksheet = JSON.parse(data[0].edoc).worksheet;
            let availableCols = worksheet.worksheet_columns.map((col: any) => ({
                name: col.name,
                type: col.properties.column_type === 'ATTRIBUTE' ? ColumnType.ATTRIBUTE : ColumnType.MEASURE,
            }));
            setColumns(availableCols);
        });
    }, []);

    const handleMetricChange = (column: Column) => {
        setMetrics((prevMetrics) =>
            prevMetrics.includes(column)
                ? prevMetrics.filter((metric) => metric !== column)
                : [...prevMetrics, column]
        );
    };

    const handleDimensionChange = (column: Column) => {
        setDims((prevDims) =>
            prevDims.includes(column)
                ? prevDims.filter((dim) => dim !== column)
                : [...prevDims, column]
        );
    };

    const handlePrimaryMetricChange = (column: Column) => setPrimaryMetric(column);
    const handleBaselineMetricChange = (column: Column) => setBaselineMetric(column);
    const handlePrimaryDimensionChange = (column: Column) => setPrimaryDim(column);

    const setConfiguration = () => {
        setColumnConfiguration({
            metrics,
            dimensions: dims,
            primaryMetric,
            baselineMetric,
            primaryDimension: primaryDim,
            dateAggregation: dateAgg,
        });
    };

    const availableColumns = columns.filter(
        (col) =>
            !metrics.includes(col) &&
            !dims.includes(col) &&
            col !== primaryMetric &&
            col !== baselineMetric &&
            col !== primaryDim
    );

    const selectedColumns = [...metrics, ...dims];

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold">Configure Your Report</h2>
            <div className="mb-6 mt-6">
                <label className="block text-lg font-semibold mb-4 font-medium text-gray-700" >
                    Date Aggregation
                </label>
                <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={dateAgg || ''}
                    onChange={(e) => setDateAgg(e.target.value as unknown as DateAggregation)}
                >
                    <option value="">Select a date aggregation</option>
                    {Object.values(DateAggregation)
                        .filter((agg) => typeof agg === 'string')  // Filter out numeric values
                        .map((agg) => (
                            <option key={agg} value={agg}>
                                {agg}
                            </option>
                        ))}
                </select>
            </div>

            <div className="mb-6 p-4 bg-gray-100 rounded-md border border-gray-300">
                <h3 className="text-lg font-semibold mb-4">Selected Columns</h3>
                <div className="flex justify-between">
                    {/* Left - Selected Dimensions */}
                    <div className="w-1/2 pr-2">
                        <h4 className="text-sm font-medium mb-2">Dimensions</h4>
                        {dims.length === 0 && (
                            <p className="text-gray-500">No dimensions selected.</p>
                        )}
                        {dims.map((col) => (
                            <div
                                key={col.name}
                                className={`mb-2 p-3 border rounded-md flex items-center justify-between ${
                                    col === primaryDim ? 'bg-blue-100 border-blue-400' : 'bg-blue-50'
                                }`}
                            >
                                <span className={`text-lg font-medium text-blue-700`}>
                                    {col.name}
                                </span>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="primaryDim"
                                        checked={primaryDim === col}
                                        onChange={() => handlePrimaryDimensionChange(col)}
                                    />
                                    <span>Primary</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Right - Selected Metrics */}
                    <div className="w-1/2 pl-2">
                        <h4 className="text-sm font-medium mb-2">Metrics</h4>
                        {metrics.length === 0 && (
                            <p className="text-gray-500">No metrics selected.</p>
                        )}
                        {metrics.map((col) => (
                            <div
                                key={col.name}
                                className={`mb-2 p-3 border rounded-md flex items-center justify-between ${
                                    col === primaryMetric ? 'bg-green-100 border-green-400' : 'bg-green-50'
                                }`}
                            >
                                <span className={`text-lg font-medium text-green-700`}>
                                    {col.name}
                                </span>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="primaryMetric"
                                            checked={primaryMetric === col}
                                            onChange={() => handlePrimaryMetricChange(col)}
                                        />
                                        <span>Primary</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="baselineMetric"
                                            checked={baselineMetric === col}
                                            onChange={() => handleBaselineMetricChange(col)}
                                        />
                                        <span>Baseline</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Available Columns */}
            <div className="flex flex-col w-full">
                <h3 className="text-lg font-semibold mb-4">Available Columns</h3>
                <div className="max-h-96 overflow-y-auto">
                    {availableColumns.map((col) => (
                        <div
                            key={col.name}
                            className={`mb-2 p-3 border rounded-md flex items-center justify-between ${
                                col.type === ColumnType.ATTRIBUTE ? 'bg-blue-50' : 'bg-green-50'
                            }`}
                        >
                            <span
                                className={`text-lg font-medium ${
                                    col.type === ColumnType.ATTRIBUTE
                                        ? 'text-blue-700'
                                        : 'text-green-700'
                                }`}
                            >
                                {col.name}
                            </span>
                            <div className="flex space-x-4">
                                {col.type === ColumnType.MEASURE && (
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={metrics.includes(col)}
                                            onChange={() => handleMetricChange(col)}
                                        />
                                        <span>Metric</span>
                                    </label>
                                )}
                                {col.type === ColumnType.ATTRIBUTE && (
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={dims.includes(col)}
                                            onChange={() => handleDimensionChange(col)}
                                        />
                                        <span>Dimension</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full bg-white p-4 shadow-md mt-6">
                <button
                    className="w-full p-3 bg-blue-600 text-white rounded-md"
                    onClick={setConfiguration}
                >
                    Apply Configuration
                </button>
            </div>
        </div>
    );
};

export default ColumnSelection;
