// Sample helloworld is an App Engine app.
package main

// [START import]
import (
	"fmt"
	"log"
	"net/http"
	"os"

	"google.golang.org/api/oauth2/v2"

)

// [END import]
// [START main_func]

func main() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/signin", loginHandler)

	// [START setting_port]
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
	// [END setting_port]
}

// [END main_func]

// [START indexHandler]

// indexHandler responds to requests with our greeting.
func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Fprint(w, "<html><body><a href='signin.html'>Bonjour, Tout Le Monde!</a></body></html>")
}

// loginHandler responds to login requests
func loginHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("got login request")
	log.Printf("Headers: %v", r.Header)
	log.Printf("idtoken: %s", r.FormValue("idtoken"))
	
	tInfo, err := verifyIdToken(r.FormValue("idtoken"))
	log.Printf("err=%v\ntokenInfo=%v", err, tInfo)
	if err != nil {
		log.Printf("err on token id: %v", err)
		http.Error(w, "err of token id", 403)
	} else {
		log.Printf("authenticated, token id: %v", tInfo)
		fmt.Fprintf(w, "token authenticated: %v", tInfo)
	}
}

var httpClient = &http.Client{}

func verifyIdToken(idToken string) (*oauth2.Tokeninfo, error) {
	log.Printf("httpClient=%v", httpClient)
	oauth2Service, err := oauth2.New(httpClient)
	tokenInfoCall := oauth2Service.Tokeninfo()
	tokenInfoCall.IdToken(idToken)
	tokenInfo, err := tokenInfoCall.Do()
	if err != nil {
		return nil, err
	}
	return tokenInfo, nil
}
