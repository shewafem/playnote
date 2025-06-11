import SavedConfigsTable from "@/components/profile/saved-configs-table"; 
export default function MyConfigurationsPage() {
	return (
		<div className="container mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-6 text-center">Мои сохраненные схемы</h1>
			<SavedConfigsTable />
		</div>
	);
}
