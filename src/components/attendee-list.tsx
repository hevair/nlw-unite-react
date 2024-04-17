import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
    id: number,
    name: string,
    email: string,
    createdAt: string,
    checkedInAt: string | null
}

export function AttendeeList() {
    const [valorInput, setInput] = useState('')
    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())
        
        if(url.searchParams.has('page')){
            return Number(url.searchParams.get('page'))
        }

        return 1
    })

    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [total, setTotal] = useState(0)
    const totalPage = Math.ceil(total / 10)

    useEffect(() => {
        const url = new URL("http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees")
        url.searchParams.set('pageIndex', String(page - 1))
        if (valorInput.length > 0)
            url.searchParams.set('query', valorInput)

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data.attendees)
                setAttendees(data.attendees)
                setTotal(data.total)
            })
    }, [page, valorInput])

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }

    function setCurrentPage(page: number){
        const url = new URL(window.location.toString())

        url.searchParams.set('page', String(page))

        window.history.pushState({}, "", url)

        setPage(page)
    }

    function setCurrentSearch(search: string){
        const url = new URL(window.location.toString())

        url.searchParams.set('search', String(search))

        window.history.pushState({}, "", url)

        setInput(search)
    }

    function goToNextPage() {
        // setPage(page + 1)
        console.log(page)
        setCurrentPage(page + 1)
    }

    function goToPreviouPage() {
        setCurrentPage(page - 1)
    }

    function goToFirstPage() {
        setCurrentPage(1)
    }

    function goToLastPage() {
        setCurrentPage(totalPage)
    }
    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participante</h1>
                <div className="px-3 py-1.5 w-72 border border-white/10 bg-transparent rounded-lg flex items-center gap-3">
                    <Search className='size-4 text-emerald-300' />
                    <input onChange={onSearchInputChanged} value={valorInput} 
                        className="bg-transparent flex-1 outline-none ring-0 border-0 p-0 text-sm focus:ring-0 " 
                        type="text" placeholder="Buscar Participante" />
                </div>
            </div>
            <Table>
                <thead>
                    <TableRow className='border-b border-white/10'>
                        <TableHeader style={{ width: '38px' }}>
                            <input type="checkbox" className=' size-4 bg-black/20 around border-white/10 checked:bg-orag' />
                        </TableHeader>
                        <TableHeader>Codigo</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de Inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: '64px' }}>

                        </TableHeader>
                    </TableRow>
                </thead>
                <tbody>
                    {/* {attendees.slice((page - 1) * 10, page * 10).map((attendee) => { */}
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id} className='border-b border-white/10 hover:bg-white/5' >
                                <TableCell>
                                    <input type="checkbox" className=' size-4 bg-black/20 around border-white/10' />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className='flex flex-col gap-1'>
                                        <span className='font-semibold text-white'>{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>{
                                    attendee.checkedInAt == null
                                        ? <span className='text-zinc-500'>"Não fez checkin"</span>
                                        : dayjs().to(attendee.checkedInAt)}</TableCell>

                                <TableCell>
                                    <button className='bg-black/20 border border-white/10 rounded-md p-1.5'>
                                        <MoreHorizontal className='size-4' />
                                    </button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <TableRow>
                        <TableCell colSpan={3}>
                            Mostrando {attendees.length} de {total} items
                        </TableCell>
                        <TableCell className='text-right' colSpan={3}>
                            <div className='inline-flex items-center gap-8'>
                                <span>Pagina {page} de {totalPage}</span>
                                <div className='flex gap-1.5'>
                                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={goToPreviouPage} disabled={page === 1}>
                                        <ChevronLeft className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={goToNextPage}>
                                        <ChevronRight className='size-4' />
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} >
                                        <ChevronsRight className='size-4' />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </tfoot>

            </Table>

        </div>

    )
}