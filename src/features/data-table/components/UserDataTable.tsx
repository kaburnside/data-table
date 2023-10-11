import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState, UIEvent } from "react";
import useUserData from "../api/getTableData"
import MaterialReactTable, { MRT_ColumnDef, MRT_SortingState, MRT_Virtualizer } from "material-react-table";
import { UserData } from "../types";
import {
    ColumnOrderState,
} from '@tanstack/react-table'
import { useAuth } from "../../../hooks/auth";
import { Button } from "@mui/material";

const originalColumnOrder = [
    'name',
    'email',
    'city',
    'registeredDate',
    'isPrivate'
];

type HeaderProps = {
    onSave: () => void;
    onLoad: () => void;
};

export const UserDataTable = () => {
    const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events
    const rowVirtualizerInstanceRef = useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() => {
        const storedOrder = localStorage.getItem("columnOrder")
        const initialColumnOrder = storedOrder ? JSON.parse(storedOrder) : originalColumnOrder;
        return initialColumnOrder;
    });

    const userQuery = useUserData();
    const { isAuth } = useAuth()
    const flatData = useMemo(
        () => userQuery.data?.pages.flatMap((page) => page.data) ?? [],
        [userQuery.data]
    );

    const handleColumnOrderChange = (newOrder: SetStateAction<ColumnOrderState>) => {
        setColumnOrder(newOrder)
    }

    const saveColumnOrder = () => {
        localStorage.setItem("columnOrder", JSON.stringify(columnOrder));
    }

    const resetColumnOrder = () => {
        localStorage.removeItem("columnOrder");
        setColumnOrder(originalColumnOrder)
    }

    const columns = useMemo<MRT_ColumnDef<UserData>[]>(
        () => [
            {
                accessorFn: (row) => `${row.firstName} ${row.lastName}`,
                id: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'city',
                header: 'City',
            },
            {
                accessorFn: (row) => row.registeredDate.toDateString(),
                id: 'registeredDate',
                header: 'Registered Date',
            },
            {
                accessorFn: (row) => row.isPrivate.toString(),
                id: 'isPrivate',
                header: 'Is Private',
            }
        ],
        [],
    );

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                if (
                    scrollHeight - scrollTop - clientHeight < 400 && !userQuery.isFetching
                ) {
                    userQuery.fetchNextPage();
                }
            }
        },
        [userQuery],
    );

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    return (
        <div>
            {isAuth &&
                <HeaderButtons
                    onSave={saveColumnOrder}
                    onLoad={resetColumnOrder} />
            }
            <MaterialReactTable
                columns={columns}
                data={flatData} //data is undefined on first render
                enableColumnOrdering={isAuth}
                enableColumnDragging={isAuth}
                enableRowVirtualization
                enableColumnActions={false}
                initialState={{
                    columnOrder: originalColumnOrder,
                }}
                onSortingChange={setSorting}
                onColumnOrderChange={handleColumnOrderChange}
                enableBottomToolbar={false}
                enableTopToolbar={false}
                state={{
                    sorting,
                    columnOrder
                }}
                muiTableContainerProps={{
                    ref: tableContainerRef, //get access to the table container element
                    sx: { maxHeight: '600px' }, //give the table a max height
                    onScroll: (
                        event: UIEvent<HTMLDivElement>, //add an event listener to the table container element
                    ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
                }}
                enablePagination={false}
                rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
                rowVirtualizerProps={{ overscan: 4 }}
            />
        </div>
    );
};

const HeaderButtons = ({ onSave, onLoad }: HeaderProps) => {
    return (
        <div>
            <Button onClick={onSave}>Save</Button>
            <Button onClick={onLoad}>Load</Button>
        </div>
    )
}
