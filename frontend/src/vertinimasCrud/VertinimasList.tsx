import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
 
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess, notifyFailure } from 'app/notify';

import { VertinimasForL } from './models';


/**
 * Component state.
 */
class State
{
	isInitialized : boolean = false;
	isLoading : boolean = false;
	isLoaded : boolean = false;

	entities : VertinimasForL[] = [];

	isDeleting : boolean = false;
	entToDel : VertinimasForL | null = null;

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}


/**
 * List the instances of the vertinimas.
 * @returns Component HTML.
 */
function VertinimasList() {
	//get state container and state updater
	const [state, updateState] = useState(new State());

	//get router stuff
	const navigate = useNavigate();
	const location = useLocation();


	/**
	 * This is used to update state without the need to return new state instance explicitly.
	 * It also allows updating state in one liners, i.e., 'update(state => state.xxx = yyy)'.
	 * @param updater State updater function.
	 */
	let update = (updater : (state : State) => void) => {
		updateState(state => {
			updater(state);
			return state.shallowClone();
		})
	}

	//(re)initialize
	if( !state.isInitialized || location.state === "refresh" ) {
		//query data
		backend.get<VertinimasForL[]>(
			config.backendUrl + "/vertinimas/list"
		)
		.then(resp => {
			update(state => {
				//indicate loading finished successfully
				state.isLoading = false;
				state.isLoaded = true;

				//store data loaded
				state.entities = resp.data;
			})
		})

		//drop location state to prevent infinite re-updating
		location.state = null;
		
		//indicate data is loading and initialization done
		update(state => {
			state.isLoading = true;
			state.isLoaded = false;
			state.isInitialized = true;
		});
	}

	/**
	 * Handles 'create' command.
	 */
	let onCreate = () => {
		navigate("./create");
	}

	/**
	 * Handles 'edit' command.
	 * @param id ID of the vertinimas to edit.
	 */
	let onEdit = (id : number) => {
		navigate(`./edit/${id}`);
	}

	/**
	 * Handles 'delete' command.
	 */
	let onDelete = () => {
		update(() => {
			//close delete dialog
			state.isDeleting = false;

			//send delete request to backend
			backend.get(
				config.backendUrl + "/vertinimas/delete",
				{
					params : {
						id : state.entToDel!.id
					}
				}
			)
			//success
			.then(resp => {
				//force reloading of vertinimas list
				update(() => location.state = "refresh");

				//show success message
				notifySuccess("Entity deleted.");
			})
			//failure
			.catch(err => {
				//notify about operation failure
				let msg = 
					`Deletion of vertinimas '${state.entToDel!.id}' has failed. ` +
					`either vertinimas is not deletable or there was backend failure.`;
				notifyFailure(msg);
			})
		});
	}

	//render component html
	let html = 
		<>
		<div className="d-flex flex-column h-100">
		{ state.isLoading &&
			<div className="d-flex flex-column h-100 justify-content-center align-items-center">
				<span className="alert alert-info mx-2">Loading data...</span>
			</div>
		}
		{ state.isInitialized && !state.isLoading && !state.isLoaded &&
			<div className="d-flex flex-column h-100 justify-content-center align-items-center">
				<span className="alert alert-warning mx-2">Backend failure, please try again...</span>
			</div>
		}
		{ state.isLoaded &&
			<>			
			<div className="mb-1">List of entities</div>

			<Dialog
				visible={state.isDeleting} 
				onHide={() => update(() => state.isDeleting = false)}
				header={<span className="me-2">Confirm vertinimas deletion, please.</span>}
				style={{width: "50ch"}}
				>
				<div className="alert alert-warning">Do you really want to delete the following vertinimas?</div>
				
				<label htmlFor="id" className="form-label">ID:</label>
				<div id="id">{state.entToDel?.id}</div>

				<label htmlFor="pavadinimas" className="form-label">Pavadinimas:</label>
				<div id="pavadinimas">{state.entToDel?.komentaras}</div>

				<label htmlFor="data" className="form-label">Data:</label>
				<div id="data">{state.entToDel?.data}</div>

				<label htmlFor="salis" className="form-label">Šalis:</label>
				<div id="salis">{state.entToDel?.ivertinimas}</div>

				<label htmlFor="sezonusk" className="form-label">Naudotojo ID:</label>
				<div id="sezonusk">{state.entToDel?.fk_naudotojo_id}</div>

				<label htmlFor="epizodusk" className="form-label">Serialo ID:</label>
				<div id="epizodusk">{state.entToDel?.fk_serialo_id}</div>
				
				<div className="d-flex justify-content-end">
					<button
						type="button"
						className="btn btn-primary me-2"
						onClick={() => onDelete()}
						>Confirm</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => update(() => state.isDeleting = false)}
						>Cancel</button>
				</div>
			</Dialog>

			<div className="d-flex flex-grow-1 overflow-hidden justify-content-center align-items-center">
				<DataTable 
					value={state.entities} 
					className="with-fixes"
					paginator rows={8} rowsPerPageOptions={[8,16,32]}
					stateStorage="session" stateKey="entity-list" 
					>
					<Column field="id" header="ID"/>
					<Column field="komentaras" header="Komentaras"/>
					<Column field="data" header="Data"/>
					<Column field="ivertinimas" header="Įvertinimas"/>
					<Column field="fk_naudotojo_id" header="Naudotojo ID"/>
					<Column field="fk_serialo_id" header="Serialo ID"/>

					<Column 
						header="Actions" 
						body={(row : VertinimasForL) => {
							return (<>
								<button
									type="button"
									className="btn btn-primary btn-sm mx-1"
									onClick={() => onEdit(row.id)}
									><i className="fa-solid fa-pen-to-square"></i></button>
								{ 
									<button
										type="button"
										className="btn btn-danger btn-sm mx-1"
										onClick={() => update(() => { state.entToDel = row; state.isDeleting = true; })}
										><i className="fa-solid fa-trash-can"></i></button>
								}
							</>);							
						}}
						/>
					

				</DataTable>
			</div>
			<div className="d-flex justify-content-center align-items-center w-100 mt-1">
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => onCreate()}
					>New</button>
			</div>
			</>
		}
		</div>
		</>;

	//
	return html;
}

//
export default VertinimasList;