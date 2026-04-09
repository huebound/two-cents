type SiteFooterProps = {
  showTagline?: boolean;
};

export function SiteFooter({ showTagline = true }: SiteFooterProps) {
  return (
    <footer className="bg-white px-6 py-8 md:px-12">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between md:justify-center">
        <span className="text-sm text-gray-600 md:absolute md:left-0">
          © Two Cents Club
        </span>
        <div className="flex gap-6">
          <a
            href="https://x.com/thetwocentsclub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            X
          </a>
          <a
            href="https://www.linkedin.com/company/two-cents-club/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/thetwocentsclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Instagram
          </a>
        </div>
        {showTagline && (
          <span className="hidden text-sm text-gray-600 md:absolute md:right-0 md:block">
            Restoring child-like curiosity
          </span>
        )}
      </div>
    </footer>
  );
}
