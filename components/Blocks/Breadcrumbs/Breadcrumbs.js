import Breadcrumbs from '@/components/Breadcrumbs';

export default function BreadcrumbsBlock(props) {
  return (
    <div className="col-span-full md:col-start-3 md:col-span-9">
      <Breadcrumbs {...props} />
    </div>
  );
}
