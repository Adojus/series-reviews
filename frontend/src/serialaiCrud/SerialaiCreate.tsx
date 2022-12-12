import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
  
import config from 'app/config';
import backend from 'app/backend';
import { notifySuccess } from 'app/notify';

import { SerialaiForCU } from './models';
import { Dropdown } from 'primereact/dropdown';


/**
 * Component state.
 */
class State
{	
	pavadinimas: string = "";
	data: Date = new Date(Date.now());
	salis: string = "";
	sezonusk: number = 0;
	epizodusk: number = 0;
	fk_kategorijos_id: number = 0;

	isNameErr : boolean = false;
	isSaveErr : boolean = false;

	isSalisErr : boolean = false;
	isSezonuskErr : boolean = false;
	isEpizoduskErr : boolean = false;
	isFkErr : boolean = false;

	/**
	 * Resets error flags to off.
	 */
	resetErrors() {
		this.isNameErr = false;
		this.isSaveErr = false;
		this.isSalisErr = false;
		this.isSezonuskErr = false;
		this.isEpizoduskErr = false;
		this.isFkErr = false;
	}

	/**
	 * Makes a shallow clone. Use this to return new state instance from state updates.
	 * @returns A shallow clone of this instance.
	 */
	shallowClone() : State {
		return Object.assign(new State(), this);
	}
}


/**
 * Log-in section in nav bar. React component.
 * @returns Component HTML.
 */
function SerialaiCreate() {
	//get state container and state updater
	const [state, setState] = useState(new State());

	//get router navigator
	const navigate = useNavigate();

	/**
	 * This is used to update state without the need to return new state instance explicitly.
	 * It also allows updating state in one liners, i.e., 'update(state => state.xxx = yyy)'.
	 * @param updater State updater function.
	 */
	let update = (updater : () => void) => {
		updater();
		setState(state.shallowClone());
	}

	let updateState = (updater : (state : State) => void) => {
		setState(state => {
			updater(state);
			return state.shallowClone();
		})
	}

	/**
	 * Handles'save' command.
	 */
	let onSave = () => {
		update(() => {
			//reset previous errors
			state.resetErrors();

			//validate form
			if( state.pavadinimas.trim() === "" )
				state.isNameErr = true;

			//errors found? abort
			if( state.isNameErr )
				return;


			//validate form
			if( state.salis.trim() === "" )
			state.isSalisErr = true;
			//errors found? abort
			if( state.isSalisErr )
				return;


			//validate form
			if( state.sezonusk < 1 )
			state.isSezonuskErr = true;
			//errors found? abort
			if( state.isSezonuskErr )
				return;
				

			//validate form
			if( state.epizodusk < 1 )
			state.isEpizoduskErr = true;
			//errors found? abort
			if( state.isEpizoduskErr )
				return;


			//validate form
			if( state.fk_kategorijos_id < 1 )
			state.isFkErr = true;
			//errors found? abort
			if( state.isFkErr )
				return;

			//drop timezone from date, otherwise we will see wrong dates when they come back from backend
			let localDate = new Date(state.data.getTime() - state.data.getTimezoneOffset() * 60 *1000);
			let onlyDate = localDate.toISOString().split('T');

			//collect entity data
			let serialas = new SerialaiForCU();
			serialas.pavadinimas = state.pavadinimas;
			serialas.data = onlyDate[0];
			serialas.salis = state.salis;
			serialas.sezonusk = state.sezonusk;
			serialas.epizodusk = state.epizodusk;
			serialas.fk_kategorijos_id = state.fk_kategorijos_id;
			
			//request entity creation
			backend.post(
				config.backendUrl + "/serialas/create",
				serialas
			)
			//success
			.then(resp => {
				//redirect back to entity list on success
				navigate("./../", { state : "refresh" });

				//show success message
				notifySuccess("Entity created.");
			})
			//failure
			.catch(err => {
				updateState(state => state.isSaveErr = true);
			});
		});		
	}

	//render component html
	let html = 
		<>
		<div className="d-flex flex-column h-100 overflow-auto">
			<div className="mb-1">Create new entity</div>

			<div className="d-flex justify-content-center">
				<div className="d-flex flex-column align-items-start" style={{width: "80ch"}}>					
					{state.isSaveErr &&
						<div 
							className="alert alert-warning w-100"
							>Saving failed due to backend failure. Please, wait a little and retry.</div>
					}	

					<label htmlFor="data" className="form-label">Data:</label>
					<Calendar
						id="data"
						className="form-control"
						value={state.data}		
						onChange={(e) => update(() => state.data = e.target.value as Date)}				
						dateFormat="yy-mm-dd"
						/>

					<label htmlFor="pavadinimas" className="form-label">Pavadinimas:</label>
					<InputText 
						id="pavadinimas" 
						className={"form-control " + (state.isNameErr ? "is-invalid" : "")}
						value={state.pavadinimas}
						onChange={(e) => update(() => state.pavadinimas = e.target.value)}
						/>
					{state.isNameErr && 
						<div className="invalid-feedback">Pavadinimas must be non empty and non whitespace.</div>
					}
					<label htmlFor="salis" className="form-label">Šalis:</label>
					<InputText 
						id="salis" 
						className={"form-control " + (state.isSalisErr ? "is-invalid" : "")}
						value={state.salis}
						onChange={(e) => update(() => state.salis = e.target.value)}
						/>
					{state.isSalisErr && 
						<div className="invalid-feedback">Salis must be non empty and non whitespace.</div>
					}
					<label htmlFor="sezonusk" className="form-label">Sezonų skaičius:</label>
					<InputText 
						id="sezonusk" 
						className={"form-control " + (state.isSezonuskErr ? "is-invalid" : "")}
						value={state.sezonusk}
						onChange={(e) => update(() => state.sezonusk = Number(e.target.value))}
						/>
					{state.isSezonuskErr && 
						<div className="invalid-feedback">Sezonu sk. invalid value.</div>
					}

					<label htmlFor="epizodusk" className="form-label">Epizodų skaičius:</label>
					<InputText 
						id="epizodusk" 
						className={"form-control " + (state.isEpizoduskErr ? "is-invalid" : "")}
						value={state.epizodusk}
						onChange={(e) => update(() => state.epizodusk = Number(e.target.value))}
						/>
					{state.isEpizoduskErr && 
						<div className="invalid-feedback">Epizodu sk. invalid value.</div>
					}

					<label htmlFor="fk_kategorijos_id" className="form-label">Kategorijos ID:</label>
					<InputText 
						id="fk_kategorijos_id" 
						className={"form-control " + (state.isFkErr ? "is-invalid" : "")}
						value={state.fk_kategorijos_id}
						onChange={(e) => update(() => state.fk_kategorijos_id = Number(e.target.value))}
						/>
					{state.isFkErr && 
						<div className="invalid-feedback">entered Kategorijos ID is invalid.</div>
					}



				</div>
			</div>

			<div className="d-flex justify-content-center align-items-center w-100 mt-1">
				<button
					type="button"
					className="btn btn-primary mx-1"
					onClick={() => onSave()}
					><i className="fa-solid fa-floppy-disk"></i> Save</button>
				<button
					type="button"
					className="btn btn-primary mx-1"
					onClick={() => navigate("./../")}
					><i className="fa-solid fa-xmark"></i> Cancel</button>
			</div>
		</div>
		</>;

	//
	return html;
}

//
export default SerialaiCreate;