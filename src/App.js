import { useState } from 'react';

function App() {
  const [guestlist, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [attending, setAttending] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setFirstName('');
    setLastName('');
  };
  const baseUrl = 'http://localhost:4000';

  async function fetchGuests() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuestList(allGuests);
  }

  async function addNewGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();
    fetchGuests().catch(() => {});
  }

  async function deleteGuest(guestId) {
    try {
      const response = await fetch(`${baseUrl}/guests/${guestId}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      return deletedGuest;
    } catch (error) {
      console.log('error');
    }
  }

  return (
    <div data-test-id="guest">
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstNameGust">First Name</label>
        <input
          value={firstName}
          onChange={(event) => {
            setFirstName(event.currentTarget.value);
          }}
        />
        <label htmlFor="lastNameGuest">Last Name</label>
        <input
          value={lastName}
          onChange={(event) => {
            setLastName(event.currentTarget.value);
          }}
        />
        <button
          onClick={() => {
            addNewGuest();
          }}
        >
          Add
        </button>
      </form>

      <ul>
        {guestlist.map((guest) => {
          return (
            <li key={guest.id}>
              <input
                checked={attending}
                type="checkbox"
                onChange={(event) => setAttending(event.currentTarget.checked)}
              />
              {guest.firstName} {guest.lastName} {'   '}
              <button
                onClick={() => {
                  deleteGuest(guest.id)
                    .then((deletedGuest) => {
                      console.log(deletedGuest);
                      const newGuestList = guestlist.filter((guest) => {
                        return guest.id !== deletedGuest.id;
                      });
                      setGuestList(newGuestList);
                    })
                    .catch(() => {});
                }}
              >
                X
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;

/* function addNewGuest() {
    return guest.push({
      firstNameGuest: setFirstName,
      lastNameGuest: setLastName,
    });
  }

  addNewGuest(); */
