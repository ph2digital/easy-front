import React from 'react';
import { cn } from '../../../utils/cn';

interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
  }[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function Table<T extends { id?: string | number }>({
  data,
  columns,
  onRowClick,
  className,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("min-w-full divide-y divide-gray-200", className)}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr
              key={item.id || rowIndex}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "hover:bg-gray-50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(item) as React.ReactNode
                    : item[column.accessor] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}