import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Bank & Bend | Fishing Finder',description:'Find Washington and Oregon bank-fishing access, compare personal-fit scores, and check dated conditions.',icons:{icon:'/favicon.svg'}};
export const viewport:Viewport={themeColor:'#121e19',colorScheme:'dark'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
