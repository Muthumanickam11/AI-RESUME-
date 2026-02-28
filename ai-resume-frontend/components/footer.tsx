export function Footer() {
  return (
    <footer className="mt-12">
      <div className="brand-gradient">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm text-white/90">
            {"© "}
            {new Date().getFullYear()}
            {" AI Resume & Job Matcher. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
