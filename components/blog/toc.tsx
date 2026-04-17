import { TocItem } from '../../lib/markdownToHtml'

type Props = { items: TocItem[] }

export default function Toc({ items }: Props) {
  if (!items || items.length === 0) return null
  return (
    <div className="mb-8">
      <h4 className="text-lg font-bold leading-snug tracking-tight mb-4">Contents</h4>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${item.id}`}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors leading-snug block py-0.5"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
