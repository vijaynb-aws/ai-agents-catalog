import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let adminPrincipal = Principal.fromText("zoh3h-x2iet-nj33t-j4kea-lngjm-li2tx-j6u5d-srbbl-iubwn-2ebpb-bae");

  type Entry = {
    id : Text;
    name : Text;
    description : Text;
    category : Category;
    icon : Text;
    url : Text;
    featured : Bool;
  };

  type Category = {
    #image;
    #text;
    #audio;
    #video;
    #productivity;
  };

  type UserProfile = {
    name : Text;
  };

  module Entry {
    public func compare(e1 : Entry, e2 : Entry) : Order.Order {
      Text.compare(e1.name, e2.name);
    };
  };

  let store = Map.empty<Text, Entry>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 1;
  var categories = ["image", "text", "audio", "video", "productivity"];

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// Checks if the given Principal is an admin (internal use).
  func isAdminInternal(caller : Principal) : Bool {
    caller == adminPrincipal or AccessControl.isAdmin(accessControlState, caller);
  };

  /// Checks if the caller is an admin (public).
  public query ({ caller }) func isAdmin() : async Bool {
    isAdminInternal(caller);
  };

  public shared ({ caller }) func addCategory(name : Text) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can add new categories");
    };
    categories := categories.concat([name]);
  };

  public query func getCategories() : async [Text] {
    categories;
  };

  public shared ({ caller }) func removeCategory(name : Text) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can remove categories");
    };
    if (isDefaultCategory(name)) {
      Runtime.trap("Cannot remove default categories");
    };
    let currentCategories = getCategoriesInternal();
    let exists = currentCategories.any(func(cat) { cat == name });

    if (not exists) {
      Runtime.trap("Category does not exist");
    };
    categories := categories.filter(func(cat) { cat != name });
  };

  func getCategoriesInternal() : [Text] {
    categories;
  };

  func isDefaultCategory(name : Text) : Bool {
    let defaultCategories = ["image", "text", "audio", "video", "productivity"];
    defaultCategories.any(func(cat) { cat == name });
  };

  public shared ({ caller }) func addEntry(
    name : Text,
    description : Text,
    category : Category,
    icon : Text,
    url : Text,
    featured : Bool,
  ) : async Text {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can add entries");
    };
    let id = nextId.toText();
    nextId += 1;

    let entry : Entry = {
      id;
      name;
      description;
      category;
      icon;
      url;
      featured;
    };

    store.add(id, entry);
    id;
  };

  public query ({ caller }) func getAllEntries() : async [Entry] {
    store.values().toArray();
  };

  public query ({ caller }) func getEntriesByCategory(category : Category) : async [Entry] {
    store.values().toArray().filter(
      func(entry) {
        switch (category, entry.category) {
          case (#image, #image) { true };
          case (#text, #text) { true };
          case (#audio, #audio) { true };
          case (#video, #video) { true };
          case (#productivity, #productivity) { true };
          case (_) { false };
        };
      }
    );
  };

  public query ({ caller }) func getFeaturedEntries() : async [Entry] {
    store.values().toArray().filter(
      func(entry) { entry.featured }
    );
  };

  public query ({ caller }) func getEntry(id : Text) : async Entry {
    switch (store.get(id)) {
      case (null) { Runtime.trap("Entry not found") };
      case (?entry) { entry };
    };
  };

  public shared ({ caller }) func updateEntry(
    id : Text,
    name : Text,
    description : Text,
    category : Category,
    icon : Text,
    url : Text,
    featured : Bool,
  ) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can update entries");
    };
    if (not store.containsKey(id)) {
      Runtime.trap("Entry does not exist");
    };

    let entry : Entry = {
      id;
      name;
      description;
      category;
      icon;
      url;
      featured;
    };

    store.add(id, entry);
  };

  public shared ({ caller }) func removeEntry(id : Text) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can remove entries");
    };
    if (not store.containsKey(id)) {
      Runtime.trap("Entry does not exist");
    };
    store.remove(id);
  };

  system func preupgrade() {
    store.remove("0");
  };
};
