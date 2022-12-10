import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
 
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess, notifyFailure } from 'app/notify';

import { SerialaiForL } from './models';


/**
 * Component state.
 */
class State
{
	isInitialized : boolean = false;
	isLoading : boolean = false;
	isLoaded : boolean = false;

	entities : SerialaiForL[] = [];

	isDeleting : boolean = false;
	entToDel : SerialaiForL | null = null;

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}


/**
 * List the instances of the serialas.
 * @returns Component HTML.
 */
function SerialaiList() {
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
		backend.get<SerialaiForL[]>(
			config.backendUrl + "/serialas/list"
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
	 * @param id ID of the serialas to edit.
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
				config.backendUrl + "/serialas/delete",
				{
					params : {
						id : state.entToDel!.id
					}
				}
			)
			//success
			.then(resp => {
				//force reloading of serialas list
				update(() => location.state = "refresh");

				//show success message
				notifySuccess("Entity deleted.");
			})
			//failure
			.catch(err => {
				//notify about operation failure
				let msg = 
					`Deletion of serialas '${state.entToDel!.id}' has failed. ` +
					`either serialas is not deletable or there was backend failure.`;
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
				header={<span className="me-2">Confirm serialas deletion, please.</span>}
				style={{width: "50ch"}}
				>
				<div className="alert alert-warning">Do you really want to delete the following serialas?</div>
				
				<label htmlFor="id" className="form-label">ID:</label>
				<div id="id">{state.entToDel?.id}</div>

				<label htmlFor="pavadinimas" className="form-label">Pavadinimas:</label>
				<div id="pavadinimas">{state.entToDel?.pavadinimas}</div>

				<label htmlFor="data" className="form-label">Data:</label>
				<div id="data">{state.entToDel?.data}</div>

				<label htmlFor="salis" className="form-label">Šalis:</label>
				<div id="salis">{state.entToDel?.salis}</div>

				<label htmlFor="sezonusk" className="form-label">Sezonų skaičius:</label>
				<div id="sezonusk">{state.entToDel?.sezonusk}</div>

				<label htmlFor="epizodusk" className="form-label">Epizodų skaičius:</label>
				<div id="epizodusk">{state.entToDel?.epizodusk}</div>
				
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
					<Column field="pavadinimas" header="Pavadinimas"/>
					<Column field="data" header="Data"/>
					<Column field="salis" header="Šalis"/>
					<Column field="sezonusk" header="Sezonų sk."/>
					<Column field="epizodusk" header="Epizodų sk."/>

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
export default SerialaiList;