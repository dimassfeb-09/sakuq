export default function Banner({ title, subtitle }) {
    return (
        <div className="flex flex-col rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-500 to-gray-100 p-4 text-white">
            <h2 className="text-2xl font-medium leading-relaxed tracking-wide">{title}</h2>
            <p className="text-sm leading-relaxed">{subtitle}</p>
        </div>
    );
}
