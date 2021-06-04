import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Layout({ menus, children }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header
        metaItems={menus?.['header_meta']?.items}
        items={menus?.['header_main']?.items}
      />
      <main id="content">{children}</main>
      <Footer
        itemsTakePart={menus?.['footer_take_part']}
        itemsAbout={menus?.['footer_about']}
        itemsMeta={menus?.['footer_meta']}
      />
    </div>
  );
}
