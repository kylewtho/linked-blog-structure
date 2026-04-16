type Props = {
  title: string;
  content: string;
  maxHeight?: number;
};

const NotePreview = ({ title, content }: Props) => {
  return (
    <span className="note-preview block col-span-2 max-w-[400px] rounded shadow-sm p-5 bg-white dark:bg-gray-800 cursor-pointer text-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-transparent">
      <span className="block font-bold leading-snug tracking-tight truncate mb-1 text-gray-900 dark:text-gray-100">
        {title}
      </span>
      <span
        className={`block font-normal text-gray-600 dark:text-gray-400 whitespace-pre-line max-h-[90px] overflow-hidden`}
      >
        {content}
      </span>
    </span>
  );
};

export default NotePreview;
