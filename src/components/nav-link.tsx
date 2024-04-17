import { ComponentProps } from "react"

interface NavLinkProps extends ComponentProps<'a'> {
    children: string
    href?: string
    activo?: boolean
}

export function NavLink(props: NavLinkProps) {
    return (
        <a {...props}  className='font-medium text-sm text-zinc' href="">{props.children}</a>
    )
}